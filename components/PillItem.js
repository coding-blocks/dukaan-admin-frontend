import React from 'react'

function PillItem(props) {
    return(
        <div className="pill dashed pill-grey font-mds mb-4 mr-4 normal">
            <button>{props.value}</button>
        </div>
    )
}

export default PillItem;