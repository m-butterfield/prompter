package controllers

import (
	"context"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/m-butterfield/prompter/server/app/lib"
	gogpt "github.com/sashabaranov/go-gpt3"
	"io"
	"os"
)

func chat(c *gin.Context) {
	prompt := c.Query("prompt")
	if prompt == "" {
		c.AbortWithStatus(400)
		return
	}

	gpt := gogpt.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()

	req := gogpt.CompletionRequest{
		Model:       gogpt.GPT3TextCurie001,
		Temperature: 0.4,
		MaxTokens:   99,
		Prompt:      prompt,
		Stream:      true,
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
			fmt.Print(msg)
			c.SSEvent("message", "\""+msg+"\"") // somehow leading whitespace was being stripped from the msg, wrap message in quotes to avoid this and strip them on the FE
			return true
		}
		return false
	})
}
