package data

type TestStore struct {
	TestCreateUser      func(*User) error
	CreateUserCallCount int
	TestGetUser         func(string) (*User, error)
	GetUserCallCount    int
}

func (t *TestStore) CreateUser(user *User) error {
	t.CreateUserCallCount += 1
	return t.TestCreateUser(user)
}

func (t *TestStore) GetUser(username string) (*User, error) {
	t.GetUserCallCount += 1
	return t.TestGetUser(username)
}
