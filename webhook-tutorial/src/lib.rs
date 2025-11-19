use crate::tutorial::workflow::workflow;
use anyhow::Result;
use wit_bindgen::generate;
use wstd::http::body::Body;
use wstd::http::{Error, Request, Response, StatusCode};

generate!({ generate_all });

const ITERATIONS: u64 = 10;

#[wstd::http_server]
async fn main(request: Request<Body>) -> Result<Response<Body>, Error> {
    let path = request.uri().path_and_query().unwrap().as_str();
    let response = match path {
        "/serial" => {
            workflow::serial(ITERATIONS).unwrap();
            Response::builder().body(Body::from("serial workflow finished"))
        }
        "/parallel" => {
            workflow::parallel(ITERATIONS).unwrap();
            Response::builder().body(Body::from("parallel workflow finished"))
        }
        _ => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("not found")),
    }
    .unwrap();
    Ok(response)
}
