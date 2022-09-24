# Dezoofier

## Team Members
* [Alex Trefilov](https://alex.trefilov.dev/)
([@volifter](https://github.com/Volifter))

## Tool Description
Getting into open source investigation can be challenging.

A newbie investigator can easily get lost in the multitude of online tools and
interfaces available on the internet.
For instance, on the day of writing this document, Bellingcat's
[Online Investigation Toolkit](https://bit.ly/bcattools) lists over 300 online
tools that accept many types of input data and serve different purposes.

Even as an experienced investigator, sometimes you need to quickly find a tool
that would allow you to obtain more details from limited pieces of information
that you have.

This is the reason why Bellingcat's Online Investigation Toolkit is constantly
flooded with users (represented as animals on Google Drive's interface) who have
to look for the tools they need inside a spreadsheet.

But what if there was a better way of finding the tool that fulfils your goals?

Maybe there is a way to... *Break up that zoo?*

## Installation
1. Make sure you have `npm` and `Node.js` version `18.3.0` or greater installed.
2. Clone this repository into a local directory and `cd` into it.
3. Install dependencies.
```sh
npm install
```
4. Start the web server.
```sh
npm start
```
5. Open a web browser and navigate to `127.0.0.1:8080`.
6. Have a look at the [user manual](./MANUAL.md), and enjoy scraping!

## Usage
Please refer to the [User manual](./MANUAL.md) for a complete usage guide.

## Additional Information

### Next steps

* **\[Tech\]**: Redesign the storage system to use a database instead of CSV
  files
* **\[Functionality\]**: perhaps include a backoffice interface for managing
  services, updating their scores and adding new ones
* **\[UI/UX\]**: Add more relevant icons for each service
* **\[The extra mile\]**: Implement user authorization for personalized scores
  on each service

### Limitations
At the time of writing, Dezoofier stores all data in CSV files.
Given the limited size of the data (about 300 services and 60 entities), at this
point it is not an issue in terms of performance.
However, this means that in order to update that data, one needs to open the CSV
file, make modifications to it by hand and then relaunch the server.

This process can be greatly improved by moving to database storage and
implementing a backoffice interface for elegant data management.

### Design motivations
The tool has been written in the form of a browser application because this
allows it to be simple in usage and easily accessible.
