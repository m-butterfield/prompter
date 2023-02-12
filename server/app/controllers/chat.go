package controllers

import (
	"context"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/m-butterfield/prompter/server/app/data"
	"github.com/m-butterfield/prompter/server/app/lib"
	gogpt "github.com/sashabaranov/go-gpt3"
	"io"
	"os"
	"time"
)

func chat(c *gin.Context) {
	prompt := c.Query("p")
	if prompt == "" {
		c.AbortWithStatus(400)
		return
	}
	token := c.Query("t")
	if token == "" {
		c.AbortWithStatus(403)
		return
	}

	accessToken, err := ds.GetAccessTokenByQueryToken(token)
	if err != nil {
		lib.InternalError(err, c)
		return
	}

	yesterday := time.Now().AddDate(0, 0, -1)
	queryCount, err := ds.GetQueryCountForUser(accessToken.UserID, &yesterday)
	if err != nil {
		lib.InternalError(err, c)
		return
	}
	if queryCount >= accessToken.User.DailyQueries {
		c.Stream(func(w io.Writer) bool {
			c.SSEvent("message", "Daily query limit exceeded.")
			return false
		})
		return
	}

	query := data.Query{
		UserID:    accessToken.UserID,
		QueryText: prompt,
	}
	if err = ds.CreateQuery(&query); err != nil {
		lib.InternalError(err, c)
		return
	}

	streamChat(c, prompt, accessToken.User.Username)
}

func streamChat(c *gin.Context, prompt string, username string) {
	gpt := gogpt.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()

	req := gogpt.CompletionRequest{
		Model:       gogpt.GPT3TextDavinci001,
		Temperature: 0.4,
		MaxTokens:   99,
		Prompt:      prompt,
		Stream:      true,
		User:        username,
	}

	stream, err := gpt.CreateCompletionStream(ctx, req)
	if err != nil {
		lib.InternalError(err, c)
		return
	}
	defer stream.Close()

	chanStream := make(chan string, 10)
	go func() {
		defer close(chanStream)
		for {
			response, err := stream.Recv()
			if errors.Is(err, io.EOF) {
				return
			}

			if err != nil {
				lib.InternalError(err, c)
				return
			}
			if len(response.Choices) > 0 {
				chanStream <- response.Choices[0].Text
			}
		}
	}()
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-chanStream; ok {
			c.SSEvent("message", "\""+msg+"\"") // somehow leading whitespace was being stripped from the msg, wrap message in quotes to avoid this and strip them on the FE
			return true
		}
		return false
	})
}
