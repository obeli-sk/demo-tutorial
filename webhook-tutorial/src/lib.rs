use crate::tutorial::workflow::workflow;
use anyhow::Result;
use wit_bindgen::generate;
use wstd::http::body::Body;
use wstd::http::{Error, Request, Response, StatusCode};

generate!({ generate_all });

#[wstd::http_server]
async fn main(request: Request<Body>) -> Result<Response<Body>, Error> {
    let path = request.uri().path_and_query().unwrap().as_str();
    let response = match path {
        "/serial" => {
            workflow::serial().unwrap();
            Response::builder().body(Body::from("serial workflow completed"))
        }
        "/parallel" => {
            workflow::parallel().unwrap();
            Response::builder().body(Body::from("parallel workflow completed"))
        }
        _ => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("not found")),
    }
    .unwrap();
    Ok(response)
}
