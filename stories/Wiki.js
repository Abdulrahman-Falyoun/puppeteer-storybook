// import './style1.css';
// import './style2.css';
// import './style3.css'
export const createWiki = (args) => {
    return `
<!doctype html>
<html lang="en">
<head>
<base href="/">
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Testy</title>
    <link rel="stylesheet" href="style1.css"/>
    <style>
        div {
            width: 100%;
            height: 100%;
            background-color: aliceblue;
        }

        p {
            font-family: "Yu Gothic UI",sans-serif;
        }
    </style>
    <link rel="stylesheet" href="style3.css"/>
    <style>
        h1 {
            font-weight: bold;
        }

        p {
            color: antiquewhite;
        }
    </style>
    <link rel="stylesheet"  href="style2.css"/>

    <script>
(() => {
            const styleSheets = Array.from(document.styleSheets);
            console.log(styleSheets)
            const data = styleSheets
            .filter((rule) => +rule.type === 1)
            .filter((styleSheet) => {
                  if (!styleSheet.href) {
                    return true;
                  }
                  return styleSheet.href.indexOf(window.location.origin) === 0;
            }).map(ss => {
                console.log('ss: ', ss);
                return ss;
                // return ({
                // css: Array.from(ss.rules).map(cssRule => cssRule.cssText).join("\\n"),
                // href: ss.href || Date.now().toString(36) + Math.random().toString(36).substring(2),
                // });
            });
            console.log(data);
        })();
    </script>
</head>
<body>
<div>
    <h1>Hello World!</h1>
    <p style="color: #00a8de">
        This is just a dummy text
    </p>
</div>
</body>
</html>`;

}