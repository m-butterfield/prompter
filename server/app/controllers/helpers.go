package controllers

import (
	"net"
)

func Run(port string) error {
	r, err := router()
	if err != nil {
		return err
	}
	return r.Run(net.JoinHostPort("", port))
}
