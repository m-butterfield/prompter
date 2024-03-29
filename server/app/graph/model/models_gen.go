// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"github.com/m-butterfield/prompter/server/app/data"
)

type LoginResponse struct {
	User       *data.User `json:"user"`
	QueryToken string     `json:"queryToken"`
}

type UserCreds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserStats struct {
	MaxQueries int `json:"maxQueries"`
	NumQueries int `json:"numQueries"`
}
