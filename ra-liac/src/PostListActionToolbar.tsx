import {makeStyles} from "@material-ui/core/styles";
import * as React from "react";

const usePostListActionToolbarStyles = makeStyles({
    toolbar: {
        justifyContent: 'flex-end',
        display: 'flex',
        marginTop: -1,
        marginBottom: -1,
    },
});

const PostListActionToolbar = ({ children, ...props }) => {
    const classes = usePostListActionToolbarStyles();
    return (
        <div className={classes.toolbar}>
            {React.Children.map(children, button => React.cloneElement(button, props))}
        </div>
    );
};

export default PostListActionToolbar