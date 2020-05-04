import React from 'react'


const SearchInput = (props) => {
    return (
        <div>
            <div>
                <input type={'text'} onChange={props.onChange}/>
            </div>
        </div>
    )
}

export default SearchInput;
