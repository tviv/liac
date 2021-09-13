import {Toolbar, ToolbarProps} from "ra-ui-materialui";
import React, {Children} from "react";
import {DeleteButton, SaveButton} from "ra-ui-materialui";
import {makeStyles} from "@material-ui/core/styles";
import useCanAccess from "./useCanAccess";

const Toolbar2 = (props: ToolbarProps) => {
    const toolbar = (<Toolbar {...props}/>)
    console.dir(toolbar)
    return toolbar
}

const ToolbarWithPermissions = ({children,...props}: ToolbarProps) => {

    const canDelete = useCanAccess({action: 'delete', resource: props.resource ?? ''})

    if (Children.count(children) === 0) {
        const useStyles = makeStyles(
            theme => ({
                toolbar: {
                    backgroundColor:
                        theme.palette.type === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                },
                desktopToolbar: {
                    marginTop: theme.spacing(2),
                },
                mobileToolbar: {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    zIndex: 2,
                },
                defaultToolbar: {
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                },
                spacer: {
                    [theme.breakpoints.down('xs')]: {
                        height: '5em',
                    },
                },
            }),
            { name: 'RaToolbar' }
        );
        const {
            alwaysEnableSaveButton,
            basePath,
            className,
            classes: classesOverride,
            handleSubmit,
            handleSubmitWithRedirect,
            invalid,
            pristine,
            record,
            redirect,
            resource,
            saving,
            submitOnEnter,
            undoable,
            mutationMode,
            validating,
            width,
            ...rest
        } = props;
        const classes = useStyles(props);
        // @ts-ignore
        const valueOrDefault = (value, defaultValue) =>
            typeof value === 'undefined' ? defaultValue : value;
        const disabled = !valueOrDefault(
            alwaysEnableSaveButton,
            !pristine && !validating
        );

        children = (
            <div className={classes.defaultToolbar}>
                <SaveButton
                    handleSubmitWithRedirect={
                        handleSubmitWithRedirect || handleSubmit
                    }
                    disabled={disabled}
                    invalid={invalid}
                    redirect={redirect}
                    saving={saving || validating}
                    submitOnEnter={submitOnEnter}
                />
                {record && typeof record.id !== 'undefined' && canDelete && (
                    <DeleteButton
                        basePath={basePath}
                        record={record}
                        resource={resource}
                        undoable={undoable}
                        mutationMode={mutationMode}
                    />
                )}
            </div>
        )
    }

    return (
        <Toolbar {...props} children={children}/>
    )
}

export default ToolbarWithPermissions