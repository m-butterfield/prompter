package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/m-butterfield/prompter/server/app/lib"
	"github.com/m-butterfield/prompter/server/app/static"
	"net/http"
	"path"
)

func router() (*gin.Engine, error) {
	r, err := lib.BaseRouter()
	if err != nil {
		return nil, err
	}

	staticFS := http.FS(static.FS{})
	fileServer := http.FileServer(staticFS)
	addStaticHandler(r, "/js", fileServer)

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.GET("/", index)
	r.GET("/chat", chat)
	r.POST("/graphql", graphql)

	return r, nil
}

func addStaticHandler(r *gin.Engine, prefix string, fileServer http.Handler) {
	h := func(c *gin.Context) { fileServer.ServeHTTP(c.Writer, c.Request) }
	pattern := path.Join(prefix, "/*filepath")
	r.GET(pattern, h)
	r.HEAD(pattern, h)
}
