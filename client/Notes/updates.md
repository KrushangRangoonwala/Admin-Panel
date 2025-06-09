## What is remaining in this project ?

- put api at single place
- error handling and showing error to user
- Add `Loaders` and `toast` messages


## updates by sir
- dropdown should be closed after click on outside
- MRP and Sale Price should be Different
- same subImage should not be upload
- no of product in stock according to size (ex., L, M, S, XL,..)

**Suggetion** : UI is not proper

<br>

-----------

- toasts
- errors
    + toast
    + red display text 

#### Toasts
- **When to use ?**
    + success message :
        - On post of Any thing


### UI

- i had task to create admin panel, my seniour show my task , features are ok but UI, theme , colors are not look like admin panel , can u generate UI for my website as description provided below :

- UI should look like professional because Its Admin pnel,
- apply appropriate color 


### UI

- i want UI for Admin Dashborad, UI should be as it is developed by 5 year expirenced developer

- there should be 3 boxes 
    + one box contain `total category` and according number, 
    + simillarly `total subcategory` and `total products` boxes

- make a thing that user can show below list of data(in tabular way) 
    + `category name`, `slug`, view icon , delete icon,
    + by clicking on its one category row , there should open list of its subcategory names
        - in list of subcat nmes, user have option to make new subcategory, 
        - by clicking on this, there should open one popup form, that will take input from user subcategory name,subcategory belong to which category, description  
    + user have opetion to select multiple categories and after selecting category,one delete btn should be visisble
        - by clicking on delete btn there should open one pupup for confirmation of user to delete it
    + user can make new `category`, if user choose to make new category, there should one popup form open, that take user inputs: category name, slug,one image and desciption

- in this page, user can see availabe sizes(like small S, larger L, medium M,...) in a popup dropdown, each size have icon to delete it, there should a feature by which user can add new size, by clicking on it ,a popup form open to input size name and its short name

- a horizontal navigation bar, that contains `Welcome user_name` text , home (navigate to dashbopard page) , All products(naviggate to all product page), and a user profile icon , by clicking on profile icon, there should open a popup that shows user to `logout`


- note: i want UI in jsx and css file, you don't need to implement logics of these features, you just have to make UI 


---------

## AllProduct Table

- use jsx and pure css
- make tabular layout for feilds : productName, mainImage, categoryName, mrpPrice, salePrice, status, weight
- one checkbox for each row, one checkbox for selecting all products
- last edit and delete btn
- if screen width is smaller then user can scroll horizontally to see product data
- layout should be like it will be use for proffesonal purpose

don't need to impletement state managemnet or any other react logic, 

- add search btn, csv,delete all,Upload .csv file and update data, btn
- Show ENTRIES AND SELECT page size are different
- one checkbox for each row, one checkbox for selecting all products


------ 

//  below i  provided a file created by Httrak website copier,  its fills like below files uses some npm packages, i want to uses this file in my react app, so i want below .js file code converted into the code that can be used in react components's .jsx file, 

!(function () {
  "use strict";
  var n = localStorage.getItem("language"),
    s = "en";
  function o(a) {
    document.querySelectorAll(".header-lang-img").forEach(function (t) {
      if (t) {
        switch (a) {
          case "en":
            t.src = "assets/images/flags/us.jpg";
            break;
          case "sp":
            t.src = "assets/images/flags/spain.jpg";
            break;
          case "gr":
            t.src = "assets/images/flags/germany.jpg";
            break;
          case "it":
            t.src = "assets/images/flags/italy.jpg";
            break;
          case "ru":
            t.src = "assets/images/flags/russia.jpg";
            break;
          default:
            t.src = "assets/images/flags/us.jpg";
        }
        localStorage.setItem("language", a),
          null == (n = localStorage.getItem("language")) && o(s),
          (e = new XMLHttpRequest()).open("GET", "/assets/lang/" + n + ".json"),
          (e.onreadystatechange = function () {
            var a;
            4 === this.readyState &&
              200 === this.status &&
              ((a = JSON.parse(this.responseText)),
              Object.keys(a).forEach(function (e) {
                document
                  .querySelectorAll("[data-key='" + e + "']")
                  .forEach(function (t) {
                    t.textContent = a[e];
                  });
              }));
          }),
          e.send();
      }
      var e;
    });
  }
  function t() {
    var t = document.querySelectorAll(".counter-value");
    t &&
      t.forEach(function (s) {
        !(function t() {
          var e = +s.getAttribute("data-target"),
            a = +s.innerText,
            n = e / 250;
          n < 1 && (n = 1),
            a < e
              ? ((s.innerText = (a + n).toFixed(0)), setTimeout(t, 1))
              : (s.innerText = e);
        })();
      });
  }
  function e() {
    setTimeout(function () {
      var t,
        e,
        a = document.getElementById("side-menu");
      a &&
        ((a = a.querySelector(".mm-active .active")),
        300 < (t = a ? a.offsetTop : 0)) &&
        ((t -= 100),
        (e = document.getElementsByClassName("vertical-menu")
          ? document.getElementsByClassName("vertical-menu")[0]
          : "")) &&
        e.querySelector(".simplebar-content-wrapper") &&
        setTimeout(function () {
          e.querySelector(".simplebar-content-wrapper").scrollTop = t;
        }, 0);
    }, 0);
  }
  function a() {
    for (
      var t = document
          .getElementById("topnav-menu-content")
          .getElementsByTagName("a"),
        e = 0,
        a = t.length;
      e < a;
      e++
    )
      "nav-item dropdown active" === t[e].parentElement.getAttribute("class") &&
        (t[e].parentElement.classList.remove("active"),
        t[e].nextElementSibling.classList.remove("show"));
    window.innerWidth <= 992
      ? (document
          .getElementsByClassName("vertical-menu")[0]
          .removeAttribute("style"),
        "horizontal" == document.body.getAttribute("data-layout") &&
          (document.getElementsByClassName("vertical-menu")[0].style.display =
            "none"))
      : "vertical" == document.body.getAttribute("data-layout") &&
        (document.getElementsByClassName("vertical-menu")[0].style.display =
          "block");
  }
  function l(t) {
    var e = document.getElementById(t),
      a =
        ((e.style.display = "block"),
        setInterval(function () {
          e.style.opacity || (e.style.opacity = 1),
            0 < e.style.opacity
              ? (e.style.opacity -= 0.2)
              : (clearInterval(a), (e.style.display = "none"));
        }, 200));
  }
  function i() {
    var t, e;
    feather.replace(),
      window.sessionStorage &&
        ((t = sessionStorage.getItem("is_visited"))
          ? "rtl" == document.getElementsByTagName("html")[0].style.direction
            ? sessionStorage.setItem("is_visited", "layout-direction-rtl")
            : null !== (e = document.querySelector("#" + t)) &&
              ((e.checked = !0),
              (e = t),
              1 == document.getElementById("layout-direction-ltr").checked &&
              "layout-direction-ltr" === e
                ? (document
                    .getElementsByTagName("html")[0]
                    .removeAttribute("dir"),
                  (document.getElementById("layout-direction-rtl").checked =
                    !1),
                  document
                    .getElementById("bootstrap-style")
                    .setAttribute("href", "assets/css/bootstrap.min.css"),
                  document
                    .getElementById("app-style")
                    .setAttribute("href", "assets/css/app.min.css"),
                  sessionStorage.setItem("is_visited", "layout-direction-ltr"))
                : 1 ==
                    document.getElementById("layout-direction-rtl").checked &&
                  "layout-direction-rtl" === e &&
                  ((document.getElementById("layout-direction-ltr").checked =
                    !1),
                  document
                    .getElementById("bootstrap-style")
                    .setAttribute("href", "assets/css/bootstrap-rtl.min.css"),
                  document
                    .getElementById("app-style")
                    .setAttribute("href", "assets/css/app-rtl.min.css"),
                  document
                    .getElementsByTagName("html")[0]
                    .setAttribute("dir", "rtl"),
                  sessionStorage.setItem("is_visited", "layout-direction-rtl")))
          : sessionStorage.setItem("is_visited", "layout-direction-ltr"));
  }
  function d(t) {
    document.getElementById(t) && (document.getElementById(t).checked = !0);
  }
  (window.onload = function () {
    document.getElementById("preloader") && (l("pre-status"), l("preloader"));
  }),
    i(),
    document.addEventListener("DOMContentLoaded", function (t) {
      document.getElementById("side-menu") && new MetisMenu("#side-menu");
    }),
    t();
  for (
    var r,
      c,
      u,
      m = document.body.getAttribute("data-sidebar-size"),
      b =
        ((window.onload = function () {
          1024 <= window.innerWidth &&
            window.innerWidth <= 1366 &&
            (document.body.setAttribute("data-sidebar-size", "sm"),
            d("sidebar-size-small"));
        }),
        document.getElementsByClassName("vertical-menu-btn")),
      y = 0;
    y < b.length;
    y++
  )
    b[(r = y)] &&
      b[r].addEventListener("click", function (t) {
        t.preventDefault(),
          document.body.classList.toggle("sidebar-enable"),
          992 <= window.innerWidth
            ? null == m
              ? null == document.body.getAttribute("data-sidebar-size") ||
                "lg" == document.body.getAttribute("data-sidebar-size")
                ? document.body.setAttribute("data-sidebar-size", "sm")
                : document.body.setAttribute("data-sidebar-size", "lg")
              : "md" == m
              ? "md" == document.body.getAttribute("data-sidebar-size")
                ? document.body.setAttribute("data-sidebar-size", "sm")
                : document.body.setAttribute("data-sidebar-size", "md")
              : "sm" == document.body.getAttribute("data-sidebar-size")
              ? document.body.setAttribute("data-sidebar-size", "lg")
              : document.body.setAttribute("data-sidebar-size", "sm")
            : e();
      });
  function g() {
    document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.body.classList.remove("fullscreen-enable");
  }
  if (
    (setTimeout(function () {
      var t = document.querySelectorAll("#sidebar-menu a");
      t &&
        t.forEach(function (t) {
          var e = window.location.href.split(/[?#]/)[0];
          t.href == e &&
            (t.classList.add("active"), (e = t.parentElement)) &&
            "side-menu" !== e.id &&
            (e.classList.add("mm-active"), (t = e.parentElement)) &&
            "side-menu" !== t.id &&
            (t.classList.add("mm-show"), (e = t.parentElement)) &&
            "side-menu" !== e.id &&
            (e.classList.add("mm-active"), (t = e.parentElement)) &&
            "side-menu" !== t.id &&
            (t.classList.add("mm-show"), (e = t.parentElement)) &&
            "side-menu" !== e.id &&
            e.classList.add("mm-active");
        });
    }, 0),
    (u = document.querySelectorAll(".navbar-nav a")) &&
      u.forEach(function (t) {
        var e = window.location.href.split(/[?#]/)[0];
        t.href == e &&
          (t.classList.add("active"), (e = t.parentElement)) &&
          (e.classList.add("active"),
          (t = e.parentElement).classList.add("active"),
          (e = t.parentElement)) &&
          (e.classList.add("active"),
          (t = e.parentElement).closest("li") &&
            t.closest("li").classList.add("active"),
          t) &&
          (t.classList.add("active"), (e = t.parentElement)) &&
          (e.classList.add("active"), (t = e.parentElement)) &&
          t.classList.add("active");
      }),
    (u = document.querySelector('[data-toggle="fullscreen"]')) &&
      u.addEventListener("click", function (t) {
        t.preventDefault(),
          document.body.classList.toggle("fullscreen-enable"),
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
            ? document.cancelFullScreen
              ? document.cancelFullScreen()
              : document.mozCancelFullScreen
              ? document.mozCancelFullScreen()
              : document.webkitCancelFullScreen &&
                document.webkitCancelFullScreen()
            : document.documentElement.requestFullscreen
            ? document.documentElement.requestFullscreen()
            : document.documentElement.mozRequestFullScreen
            ? document.documentElement.mozRequestFullScreen()
            : document.documentElement.webkitRequestFullscreen &&
              document.documentElement.webkitRequestFullscreen(
                Element.ALLOW_KEYBOARD_INPUT
              );
      }),
    document.addEventListener("fullscreenchange", g),
    document.addEventListener("webkitfullscreenchange", g),
    document.addEventListener("mozfullscreenchange", g),
    document.getElementById("topnav-menu-content"))
  ) {
    for (
      var p = document
          .getElementById("topnav-menu-content")
          .getElementsByTagName("a"),
        h = 0,
        E = p.length;
      h < E;
      h++
    )
      p[h].onclick = function (t) {
        "#" === t.target.getAttribute("href") &&
          (t.target.parentElement.classList.toggle("active"),
          t.target.nextElementSibling.classList.toggle("show"));
      };
    window.addEventListener("resize", a);
  }
  [].slice
    .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(function (t) {
      return new bootstrap.Tooltip(t);
    }),
    [].slice
      .call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      .map(function (t) {
        return new bootstrap.Popover(t);
      }),
    [].slice.call(document.querySelectorAll(".toast")).map(function (t) {
      return new bootstrap.Toast(t);
    }),
    "null" != n && n !== s && o(n),
    (u = document.querySelectorAll(".language")) &&
      u.forEach(function (e) {
        e.addEventListener("click", function (t) {
          o(e.getAttribute("data-lang"));
        });
      }),
    document
      .getElementById("layout-width-boxed")
      .addEventListener("click", function () {
        d("sidebar-size-small"),
          document.body.setAttribute("data-sidebar-size", "sm");
      }),
    (c = document.getElementsByTagName("body")[0]),
    (u = document.querySelectorAll(".light-dark")) &&
      u.forEach(function (t) {
        t.addEventListener("click", function (t) {
          c.hasAttribute("data-bs-theme") &&
          "dark" == c.getAttribute("data-bs-theme")
            ? (d(".layout-mode-light"),
              document.body.setAttribute("data-bs-theme", "light"),
              "vertical" == document.body.getAttribute("data-layout") &&
                document.body.setAttribute("data-topbar", "light"))
            : (d(".layout-mode-dark"),
              document.body.setAttribute("data-bs-theme", "dark"),
              "vertical" == document.body.getAttribute("data-layout") &&
                document.body.setAttribute("data-topbar", "dark"));
        });
      }),
    (c = document.body),
    document
      .getElementById("right-bar-toggle")
      .addEventListener("click", function (t) {
        c.classList.toggle("right-bar-enabled");
      }),
    c.addEventListener("click", function (t) {
      (!t.target.parentElement.classList.contains("right-bar-toggle-close") &&
        t.target.closest(".right-bar-toggle, .right-bar")) ||
        document.body.classList.remove("right-bar-enabled");
    }),
    (c = document.getElementsByTagName("body")[0]).hasAttribute(
      "data-layout"
    ) && "horizontal" == c.getAttribute("data-layout")
      ? (d("layout-horizontal"),
        (document.getElementById("sidebar-setting").style.display = "none"),
        (document.getElementsByClassName("vertical-menu")[0].style.display =
          "none"),
        (document.getElementsByClassName(
          "ishorizontal-topbar"
        )[0].style.display = "block"),
        (document.getElementsByClassName("isvertical-topbar")[0].style.display =
          "none"))
      : (d("layout-vertical"),
        (document.getElementById("sidebar-setting").style.display = "block"),
        (document.getElementsByClassName("vertical-menu")[0].style.display =
          "block"),
        (document.getElementsByClassName(
          "ishorizontal-topbar"
        )[0].style.display = "none")),
    c.hasAttribute("data-bs-theme") && "dark" == c.getAttribute("data-bs-theme")
      ? d("layout-mode-dark")
      : d("layout-mode-light"),
    c.hasAttribute("data-layout-size") &&
    "boxed" == c.getAttribute("data-layout-size")
      ? d("layout-width-boxed")
      : d("layout-width-fluid"),
    c.hasAttribute("data-layout-scrollable") &&
    "true" == c.getAttribute("data-layout-scrollable")
      ? d("layout-position-scrollable")
      : d("layout-position-fixed"),
    c.hasAttribute("data-topbar") && "dark" == c.getAttribute("data-topbar")
      ? d("topbar-color-dark")
      : d("topbar-color-light"),
    c.hasAttribute("data-sidebar-size") &&
    "sm" == c.getAttribute("data-sidebar-size")
      ? d("sidebar-size-small")
      : c.hasAttribute("data-sidebar-size") &&
        "md" == c.getAttribute("data-sidebar-size")
      ? d("sidebar-size-compact")
      : d("sidebar-size-default"),
    c.hasAttribute("data-sidebar") && "brand" == c.getAttribute("data-sidebar")
      ? d("sidebar-color-brand")
      : c.hasAttribute("data-sidebar") &&
        "dark" == c.getAttribute("data-sidebar")
      ? d("sidebar-color-dark")
      : d("sidebar-color-light"),
    document.getElementsByTagName("html")[0].hasAttribute("dir") &&
    "rtl" == document.getElementsByTagName("html")[0].getAttribute("dir")
      ? d("layout-direction-rtl")
      : d("layout-direction-ltr"),
    document.querySelectorAll("input[name='layout'").forEach(function (t) {
      t.addEventListener("change", function (t) {
        t && t.target && "vertical" == t.target.value
          ? (d("layout-vertical"),
            document.body.setAttribute("data-layout", "vertical"),
            document.body.setAttribute("data-sidebar", "dark"),
            document.body.setAttribute("data-topbar", "light"),
            (document.getElementById("sidebar-setting").style.display =
              "block"),
            (document.getElementsByClassName(
              "isvertical-topbar"
            )[0].style.display = "block"),
            (document.getElementsByClassName(
              "ishorizontal-topbar"
            )[0].style.display = "none"),
            (document.getElementsByClassName("vertical-menu")[0].style.display =
              "block"),
            window.innerWidth <= 992 &&
              document
                .getElementsByClassName("vertical-menu")[0]
                .removeAttribute("style"),
            d("sidebar-color-dark"),
            d("topbar-color-light"))
          : (d("layout-horizontal"),
            document.body.setAttribute("data-layout", "horizontal"),
            document.body.removeAttribute("data-sidebar"),
            document.body.setAttribute("data-topbar", "dark"),
            (document.getElementById("sidebar-setting").style.display = "none"),
            (document.getElementsByClassName("vertical-menu")[0].style.display =
              "none"),
            (document.getElementsByClassName(
              "ishorizontal-topbar"
            )[0].style.display = "block"));
      });
    }),
    document
      .querySelectorAll("input[name='layout-mode']")
      .forEach(function (t) {
        t.addEventListener("change", function (t) {
          t &&
            t.target &&
            t.target.value &&
            ("light" == t.target.value
              ? (document.body.setAttribute("data-bs-theme", "light"),
                document.body.setAttribute("data-topbar", "light"),
                document.body.setAttribute("data-sidebar", "dark"),
                c.hasAttribute("data-layout") &&
                  "horizontal" == c.getAttribute("data-layout") &&
                  document.body.removeAttribute("data-sidebar"),
                d("topbar-color-light"))
              : (document.body.setAttribute("data-bs-theme", "dark"),
                document.body.setAttribute("data-topbar", "dark"),
                document.body.setAttribute("data-sidebar", "dark"),
                (c.hasAttribute("data-layout") &&
                  "horizontal" == c.getAttribute("data-layout")) ||
                  d("topbar-color-dark")),
            d("sidebar-color-dark"));
        });
      }),
    document
      .querySelectorAll("input[name='layout-direction']")
      .forEach(function (t) {
        t.addEventListener("change", function (t) {
          t &&
            t.target &&
            t.target.value &&
            ("ltr" == t.target.value
              ? (document
                  .getElementsByTagName("html")[0]
                  .removeAttribute("dir"),
                document
                  .getElementById("bootstrap-style")
                  .setAttribute("href", "assets/css/bootstrap.min.css"),
                document
                  .getElementById("app-style")
                  .setAttribute("href", "assets/css/app.min.css"),
                sessionStorage.setItem("is_visited", "layout-direction-ltr"))
              : (document
                  .getElementById("bootstrap-style")
                  .setAttribute("href", "assets/css/bootstrap-rtl.min.css"),
                document
                  .getElementById("app-style")
                  .setAttribute("href", "assets/css/app-rtl.min.css"),
                document
                  .getElementsByTagName("html")[0]
                  .setAttribute("dir", "rtl"),
                sessionStorage.setItem("is_visited", "layout-direction-rtl")));
        });
      }),
    e(),
    (u = document.getElementById("checkAll")) &&
      (u.onclick = function () {
        for (
          var t = document.querySelectorAll(
              '.table-check input[type="checkbox"]'
            ),
            e = 0;
          e < t.length;
          e++
        )
          t[e].checked = this.checked;
      });
})();
