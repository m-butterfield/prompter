package resolvers

import (
	"context"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/m-butterfield/prompter/server/app/data"
	"github.com/m-butterfield/prompter/server/app/lib"
	"log"
	"net/http"
)

func cookieLogin(ctx context.Context, ds data.Store, user *data.User) error {
	token, err := ds.CreateAccessToken(user)
	if err != nil {
		return err
	}

	gctx, err := ginContextFromContext(ctx)
	if err != nil {
		return err
	}

	http.SetCookie(gctx.Writer, &http.Cookie{
		Name:    lib.SessionTokenName,
		Value:   token.ID,
		Expires: token.ExpiresAt,
	})
	return nil
}

func ginContextFromContext(ctx context.Context) (*gin.Context, error) {
	ginContext := ctx.Value(lib.GinContextKey)
	if ginContext == nil {
		err := fmt.Errorf("could not retrieve gin.Context")
		return nil, err
	}

	gc, ok := ginContext.(*gin.Context)
	if !ok {
		err := fmt.Errorf("gin.Context has wrong type")
		return nil, err
	}
	return gc, nil
}

func loggedInUser(ctx context.Context) (*data.User, error) {
	gctx, err := ginContextFromContext(ctx)
	if err != nil {
		return nil, err
	}
	result, exists := gctx.Get(lib.UserContextKey)
	if !exists {
		return nil, nil
	}
	if user, ok := result.(*data.User); ok {
		return user, nil
	}
	return nil, errors.New("bad user type in context")
}

func internalError(err error) error {
	log.Println(err)
	return errors.New("internal system error")
}
