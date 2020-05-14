'use strict';

const confluent_jira_url = "https://confluentinc.atlassian.net/browse/";
const confluent_workday_url = "https://wd5.myworkday.com/confluent/d/search.htmld?q=";
const confluent_wiki_url = "https://confluentinc.atlassian.net/wiki/search?text=";
const confluent_git_url = "https://github.com/search?q=org%3Aconfluentinc+";
const confluent_repo_url = "https://github.com/confluentinc/";

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(query) {
    var queryStr = query.trim().replace(/\s+/g,' ');
    var length = queryStr.length;
    if (length <= 0) {
        return;
    }

    var urlStr = "";
    var opIdx = queryStr.indexOf(" ");
    if (opIdx > 0) {
        var op = queryStr.slice(0, opIdx);
        var keyword = queryStr.slice(opIdx+1);
        if (op == "j" || op == "jira") {
            // j / jira: https://confluentinc.atlassian.net/browse/<key>
            urlStr += confluent_jira_url + keyword;
        }
        else if (op == "wd" || op == "workday") {
            // wd / workday: https://wd5.myworkday.com/confluent/d/search.htmld?q=<key>
            urlStr += confluent_workday_url + keyword.replace(/ /g, "%20");
        }
        else if (op == "w" || op == "wiki") {
            // w / wiki search: https://confluentinc.atlassian.net/wiki/search?text=<key>
            urlStr += confluent_wiki_url + keyword.replace(/ /g, "%20");
        }
        else if (op == "g" || op == "git") {
            // g / git: https://github.com/search?q=org%3Aconfluentinc+<keyword>
            urlStr += confluent_git_url + keyword.replace(/ /g, "+");
        }
        else if (op == "r" || op == "repo") {
            // r / repo: https://github.com/confluentinc/<repo-name>
            urlStr += confluent_repo_url + keyword;
        }
        else {
            // unrecognized op, treat entire string as general wiki search
            urlStr += confluent_wiki_url + queryStr.replace(/ /g, "%20");
        }
    }
    else {
        // no op defined explicitly, trying jira pattern
        if (queryStr.match(/^[a-zA-Z]+-[0-9]+$/g) != null) {
            // j / jira: https://confluentinc.atlassian.net/browse/<key>
            urlStr += confluent_jira_url + queryStr;
        }
        else {
            // or just a wiki search
            urlStr += confluent_wiki_url + queryStr.replace(/ /g, "%20");
        }
    }

    chrome.tabs.update({ url: urlStr});
  });
