package resolvers

import (
	"errors"
	"log"
)

func internalError(err error) error {
	log.Println(err)
	return errors.New("internal system error")
}
