import React from 'react'

class DukaanAdminApp extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        const {Component, pageProps} = this.props;
        return (
            <div>
                <Component {...pageProps} />
            </div>
        )
    }
}


export default DukaanAdminApp
