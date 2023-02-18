export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  queryToken: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  getCheckoutSession: Scalars['String'];
  login?: Maybe<LoginResponse>;
  logout: Scalars['Boolean'];
};


export type MutationCreateUserArgs = {
  input: UserCreds;
};


export type MutationGetCheckoutSessionArgs = {
  paymentPlanName: PaymentPlanName;
};


export type MutationLoginArgs = {
  credential: Scalars['String'];
};

export enum PaymentPlanName {
  Basic = 'Basic',
  Premium = 'Premium',
  Pro = 'Pro'
}

export type PaymentPlanTemplate = {
  __typename?: 'PaymentPlanTemplate';
  name: PaymentPlanName;
  price: Scalars['String'];
  queriesPerDay: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getPaymentPlanTemplates: Array<PaymentPlanTemplate>;
  getUser: User;
  getUserStats: UserStats;
  me?: Maybe<User>;
};


export type QueryGetUserArgs = {
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
};

export type UserCreds = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserStats = {
  __typename?: 'UserStats';
  maxQueries: Scalars['Int'];
  numQueries: Scalars['Int'];
};
