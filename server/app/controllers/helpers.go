package controllers

import (
	"github.com/gin-gonic/gin/render"
	"github.com/m-butterfield/prompter/server/app/lib"
	"github.com/m-butterfield/prompter/server/app/static"
	"html/template"
	"net"
	"time"
)

const (
	templatePath = "templates/"
)

var (
	baseTemplatePaths = []string{
		templatePath + "base.gohtml",
	}
)

func Run(port string) error {
	r, err := router()
	if err != nil {
		return err
	}
	return r.Run(net.JoinHostPort("", port))
}

func templateRender(name string, data interface{}) (render.Render, error) {
	paths := append([]string{templatePath + name + ".gohtml"}, baseTemplatePaths...)
	tmpl, err := template.ParseFS(static.FS{}, paths...)
	if err != nil {
		return nil, err
	}
	return render.HTML{
		Template: tmpl,
		Data:     data,
	}, nil
}

type basePage struct {
	//User          *data.User
	ImagesBaseURL string
	Year          string
}

func makeBasePage() *basePage {
	return &basePage{
		ImagesBaseURL: lib.ImagesBaseURL,
		Year:          time.Now().UTC().Format("2006"),
	}
}
