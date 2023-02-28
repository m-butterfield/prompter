package data

import (
	"gorm.io/gorm"
	"testing"
)

func TestCreatePaymentPlan(t *testing.T) {
	s, err := getDS()
	if err != nil {
		t.Fatal(err)
	}
	user := &User{
		Username: "testUser",
	}
	if err = s.CreateUser(user); err != nil {
		t.Fatal(err)
	}
	plan := &PaymentPlan{
		Name: PaymentPlanNameBasic,
		User: user,
	}
	if err = s.CreatePaymentPlan(plan); err != nil {
		t.Fatal(err)
	}

	s.db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&PaymentPlan{})
}
