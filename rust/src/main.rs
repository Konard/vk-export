extern crate scraper;
extern crate chrono;
extern crate encoding_rs_io;
extern crate serde_json;
extern crate structopt;

use scraper::{Html, Selector};
use chrono::NaiveDateTime;
use encoding_rs_io::DecodeReaderBytesBuilder;
use serde_json::json;
use std::fs::File;
use std::io::prelude::*;
use std::path::PathBuf;
use std::time::Instant;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
struct Cli {
    #[structopt(parse(from_os_str), long = "source", short = "s", required = true)]
    source: PathBuf,
    #[structopt(parse(from_os_str),  long = "target", short = "t")]
    target: Option<PathBuf>,
}

fn main() -> std::io::Result<()> {
    let start = Instant::now();

    let args = Cli::from_args();
    
    let source_path = args.source;
    let target_path = match args.target {
        Some(t) => t,
        None => source_path.with_extension("json"),
    };
    
    let file = File::open(&source_path)?;
    let mut reader = DecodeReaderBytesBuilder::new()
        .encoding(Some(encoding_rs::WINDOWS_1252))
        .build(file);

    let mut html_buffer = String::new();
    reader.read_to_string(&mut html_buffer)?;

    let document = Html::parse_document(&html_buffer);
    let item_select = Selector::parse(".message").unwrap();
    let msg_header_select = Selector::parse(".message__header").unwrap();
    let msg_div_select = Selector::parse(".message div").unwrap();
    let attach_select = Selector::parse(".attachment").unwrap();

    let mut entries = vec![];

    for item in document.select(&item_select) {
        // let mut msg_divs = item.select(&msg_div_select);
        let msg_header = item.select(&msg_header_select).next().unwrap();
        let msg_header_content = msg_header.text().collect::<Vec<_>>();
        // let (author, date_string, is_edited) = parse_msg_header(&msg_header_content);
        // let msg_date = NaiveDateTime::parse_from_str(&date_string, "'at' h:mm:ss a 'on' d MMM yyyy").unwrap();
        // let has_attachment = msg_divs.nth(3).unwrap().select(&attach_select).next().is_some();

        // let text_element = msg_divs.next().unwrap();
        // let text = text_element.text();

        let mut entry = json!({
            "id": item.value().attr("data-id").unwrap_or(""),
            // "author": author,
            // "date": msg_date,
            // "isEdited": is_edited,
            // "hasAttachment": has_attachment
            // "text": text,
        });  

        entries.push(entry);
    }

    let encoded = serde_json::to_string_pretty(&entries)?;
    let mut file = File::create(target_path)?;
    file.write_all(encoded.as_bytes())?;

    let duration = start.elapsed();
    println!("Execution Time: {:?}", duration);

    Ok(())
}

// fn parse_msg_header(header: &Vec<&str>) -> (&str, &str, bool) {
//     (header[0], header[1], header.len() == 3)
// }
fn parse_msg_header<'a>(header: &'a Vec<&str>) -> (&'a str, &'a str, bool) {
    (header[0], header[1], header.len() == 3)
}