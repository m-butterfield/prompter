package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/m-butterfield/prompter/server/app/lib"
)

func router() (*gin.Engine, error) {
	r, err := lib.BaseRouter()
	if err != nil {
		return nil, err
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.GET("/chat", chat)
	r.POST("/graphql", graphql)

	return r, nil
}
