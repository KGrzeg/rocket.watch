import { QueryString, load } from '../js/utils'
import search from './search'

export default function agency(m) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    if (m != "undefined") {
        load("agency/" + m + "?mode=verbose&format=news", function (g) {
            if (g.agencies.length) {
                let c = g.agencies[0];

                $info.innerHTML = '<div class="card-content"><img class="circle logo materialboxed" src="' + c.icon + '" onerror=this.onerror=null;this.style.display="none";><h1 class="tooltipped" data-tooltip="' + c.shortname + '">' + c.name.split(" (")[0] + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltip="Country summary" href="/#country=' + c.countryCode + '"><img src="' + c.countryFlag + '">' + c.countryCode + '</a><a class="chip">Founded: ' + c.founded + '</a></div><p class="flow-text">' + c.description + '</p></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div></div>';

                if (c.news && Object.keys(c.news).length) {
                    $main.innerHTML += '<div id="news"><div class="card-tabs"><ul id="tabs" class="tabs tabs-fixed-width"></ul></div></div>';
                    document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#news">News</a></li>';

                    let $list = document.getElementById("news");

                    if ($query.type == "failures") $list.style.display = "none";

                    //<div class="col s12"><div class="card"><div class="card-content"><h5><a>Subscribe to news & updates notifications</a></h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" onclick="subscribe()">Subscribe</a></div></div>
                    if (c.news.reddit) {
                        document.getElementById("tabs").innerHTML += '<li class="tab"><a class="active" href="#reddit">Reddit</a></li>';
                        let a = document.createElement("div");
                        a.id = "reddit";
                        for (let b in c.news.reddit) {
                            let h = c.news.reddit[b];
                            a.innerHTML += '<div class="col s12"><div class="card"><div class="card-content"><img class="materialboxed circle" onerror=this.onerror=null;this.style.display="none" src="' + h.img + '" /><h5>' + h.title + '</h5><p class="flow-text">' + h.content + '</p></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="' + h.url + '" target="_blank">Read more</a></div></div></div></div>'
                        }
                        $list.appendChild(a)
                    }

                    if (c.news.youtube) {
                        document.getElementById("tabs").innerHTML += '<li class="tab"><a href="#youtube">YouTube</a></li>';
                        let s = document.createElement("div");
                        s.id = "youtube";
                        for (let b in c.news.youtube) {
                            let h = c.news.youtube[b];
                            s.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><iframe src="' + h.url + '"></iframe></div><div class="card-content"><p class="flow-text">' + h.content + "</p></div></div></div>"
                        }
                        $list.appendChild(s)
                    }

                    if (c.news.twitter) {
                        document.getElementById("tabs").innerHTML += '<li class="tab"><a href="#twitter">Twitter</a></li>';
                        let u = document.createElement("div");
                        u.id = "twitter";
                        u.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><a class="twitter-timeline" data-dnt="true" href="https://twitter.com/' + c.social.twitter + '" ' + ($settings.dark ? " data-theme=\"dark\"" : "") + '></a></div></div></div>';
                        $list.appendChild(u);
                        if (twttr) {
                            twttr.widgets.load();
                        }
                    }
                }

                if (c.wiki.length) {
                    document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';

                    $main.innerHTML += '<div id="information"><div class="card"><div class="video-container"><iframe  src="' + c.wiki.replace("http://", "https://") + '"></iframe></div></div></div>'
                }

                search((c.islsp ? "&lsp=" : "&agency=") + c.id);
            } else {
                $main.innerHTML = '<h1 class="white-text" ="location.reload(true)">' + g.msg || g.status || "Error</h1>"
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 30;
        let offset = perPage * (page - 1);
        load("agency?limit=" + perPage + "&islsp=1&offset=" + offset, function (c) {
            if (c.agencies.length) {
                $main.innerHTML = '';
                $info.innerHTML = '<div class="card-content"><h1>Agencies</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#agency&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(c.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#agency&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                for (let b in c.agencies) {
                    let a = c.agencies[b];
                    $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate">' + a.name + '</h5><a class="chip"><img src="' + a.icon + '" onerror=this.onerror=null;this.src="' + a.countryFlag + '">' + a.abbrev + '</a><a class="chip">' + a.type + ' Agency</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#agency=' + a.id + '">Details</a></div></div>'
                }
                $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((page == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="/#agency&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + page + "/" + Math.ceil(c.total / perPage) + ' <li class="' + ((page == Math.ceil(c.total / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="/#agency&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
            } else {
                $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
            }

            // preload NEXT
            load("agency?limit=" + perPage + "&mode=verbose&islsp=1&offset=" + (perPage * page));
        });
    }
}