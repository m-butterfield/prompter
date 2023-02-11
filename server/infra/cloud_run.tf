resource "google_cloud_run_service" "prompter" {
  name     = "prompter"
  location = var.default_region

  template {
    spec {
      containers {
        image = "gcr.io/mattbutterfield/prompter"
        ports {
          container_port = 8000
        }
        env {
          name  = "GIN_MODE"
          value = "release"
        }
        env {
          name = "DB_SOCKET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.prompter_db_socket.secret_id
              key  = "latest"
            }
          }
        }
        env {
          name = "OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.prompter_openai_api_key.secret_id
              key  = "latest"
            }
          }
        }
      }
      service_account_name = google_service_account.prompter_cloud_run.email
    }
    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.mattbutterfield.connection_name
        "autoscaling.knative.dev/maxScale"      = "100"
        "client.knative.dev/user-image"         = "gcr.io/mattbutterfield/prompter"
        "run.googleapis.com/client-name"        = "gcloud"
        "run.googleapis.com/client-version"     = "416.0.0"
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.prompter.location
  project  = google_cloud_run_service.prompter.project
  service  = google_cloud_run_service.prompter.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_domain_mapping" "prompter" {
  location = var.default_region
  name     = "getprompter.app"

  metadata {
    namespace = var.project
  }

  spec {
    route_name = google_cloud_run_service.prompter.name
  }
}
