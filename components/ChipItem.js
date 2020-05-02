import React from 'react'
import Chip from '@material-ui/core/Chip';


function ChipItem({name}) {
    return(
        <div  className="font-mds mb-4 mr-4 normal">
            <Chip
                label={name}
                variant="outlined"
            />
        </div>
    )
}

export default ChipItem;