import React from "react";

const ConnectorView = (props) => {
    if (props.connector === undefined || props.connector === null) {
        return ''
    } else {
        return (
            <div className="dashboard connector-view" >
                CONNECTOR VIEW
            </div>
        );
    }
}

export default ConnectorView;