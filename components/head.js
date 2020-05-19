import React from "react";
import NextHead from "next/head";
import {string} from "prop-types";

const defaultDescription = "";
const defaultOGURL = "";
const defaultOGImage = "";

const Head = props => (
    <NextHead>
        <meta charSet="UTF-8"/>
        <title>{props.title || ""}</title>
        <meta
            name="description"
            content={props.description || defaultDescription}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link
            rel="icon"
            href="/static/img/favicon-16x16-c34ee65b4d10f4a498f372ee6266b1d2.png"
            sizes="16x16"
        />
        <link
            rel="icon"
            href="/static/img/favicon-32x32-99b67c3225de8cfd4d55265e2d039d5c.png"
            sizes="32x32"
        />
        <link
            rel="icon"
            href="/static/img/favicon-96x96-564e16968542cb2e22e303a7b7371010.png"
            sizes="96x96"
        />

        <link
            href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,700,800"
            rel="stylesheet"
        />
        <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
            integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg"
            crossOrigin="anonymous"
        />
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@coding-blocks/motley@0.3.44/dist/app.min.css" />

        <meta property="og:url" content={props.url || defaultOGURL}/>
        <meta property="og:title" content={props.title || ""}/>
        <meta
            property="og:description"
            content={props.description || defaultDescription}
        />
        <meta name="twitter:site" content={props.url || defaultOGURL}/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:image" content={props.ogImage || defaultOGImage}/>
        <meta property="og:image" content={props.ogImage || defaultOGImage}/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>

        <link
            rel="stylesheet"
            href="https://unpkg.com/@coding-blocks/motley@0.3.49/dist/app.min.css"
        />
    </NextHead>
);

Head.propTypes = {
    title: string,
    description: string,
    url: string,
    ogImage: string
};

export default Head;
