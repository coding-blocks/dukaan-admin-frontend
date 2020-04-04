import React from 'react'
import App, {Container} from 'next/app';
import * as Sentry from '@sentry/browser';

// Configure sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN
})

class DukaanAdminApp extends React.Component {

    static async getInitialProps({Component, ctx}) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return {pageProps};
    }

    constructor(props) {
        super(props)
    }


    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            Object.keys(errorInfo).forEach((key) => {
                scope.setExtra(key, errorInfo[key]);
            });

            Sentry.captureException(error);
        });

        super.componentDidCatch(error, errorInfo);
    }

    render() {
        const {Component, pageProps} = this.props;
        return (
            <div>
                <Container>
                    <Component {...pageProps} />
                </Container>
            </div>
        )
    }
}


export default DukaanAdminApp
