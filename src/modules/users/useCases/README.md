# User subdomain - use cases

The user subdomain is only responsible for Identity & Access Management and contains use cases like:

- createUser(request: RegisterUserDTO),
- verifyAccount(email: string, idToken: IdToken)  
- deleteUser(request: DeleteUserDTO),
- login(request: LoginUserDTO)
- logout(request: authToken: JWTFactoryo)
- changePassword(passwordResetToken: Token, password: UserCredential)

## Create user

The purpose of the use case - create user - is to allow anyone to "register" for the services
and when the use case is done an email verification should be sent to the registered email address 
with a verification token in a link for the user to verify the registration.

### The business rules are

A user who "register" to the service must enter;

- a username,
  - must be at least 5 chars long and not longer than 15 chars, 
- a password,
  - must be 6 to 20 characters and at least one numeric, one uppercase and one lowercase, 
- an email address,
  - must be a valid email address form

The User to be persisted must setting default values for all other properties such as,

- scope = profile,
- isEmailVerified = false,
- isAdmin = false,
- isDeleted = false.

> There must NOT be possible to overwrite an existing user. An account marked for deleting is existing

The database is modelled that a user can only have one username and one email address associated
to the account. Every username and email address is also indexed as unique.

> The account created can be seen as temporary until the user verify the account

### External interfaces

When the user is persisted, an event indicated an account has been created should be published in order 
for subscriber services interested in domain related events. 

A subscriber service to send out verification emails are in place. Other subscriber services may
also want to act when a user account has been created.

## Verify account

The purpose of the use case - verify account is to set an existing "registered" account as verified. 

The user clicks on a link in an email that has been sent out and, the link contains the user's registered
email address and a verification token.

The email address and verification token is sent as parameters to our endpoint.

### The business rules are

The verification token and the email address must be validated. The verification token has been created
by a subscriber services and, the token itself is persisted 

### External interfaces






