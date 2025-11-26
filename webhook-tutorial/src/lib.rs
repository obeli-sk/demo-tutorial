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
            let acc = workflow::serial().unwrap();
            Response::builder().body(Body::from(format!("serial workflow completed: {acc}")))
        }
        "/parallel" => {
            let acc = workflow::parallel().unwrap();
            Response::builder().body(Body::from(format!("parallel workflow completed: {acc}")))
        }
        "/sleep" => {
            workflow::sleepy_parent(10_000).unwrap();
            Response::builder().body(Body::empty())
        }
        _ => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("not found")),
    }
    .unwrap();
    Ok(response)
}
