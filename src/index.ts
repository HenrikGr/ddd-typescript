require('dotenv').config()

// Infra
import "./infra/http/app"

// Subscriptions
import "./modules/notification/subscribers";
