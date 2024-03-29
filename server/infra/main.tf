terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

provider "google" {
  credentials = file("/var/terraform/mattbutterfield.json")

  project = "mattbutterfield"
  region  = var.default_region
}

terraform {
  backend "gcs" {
    bucket = "prompter-tf-state-prod"
    prefix = "terraform/state"
  }
}
