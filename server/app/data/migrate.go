package data

func Migrate() error {
	s, err := getDS()
	if err != nil {
		return err
	}
	err = s.db.AutoMigrate(
		&AccessToken{},
		&User{},
	)
	if err != nil {
		return err
	}
	return nil
}
