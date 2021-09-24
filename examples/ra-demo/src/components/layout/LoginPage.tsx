import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, withTypes } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import {permissions} from "../../authProvider";

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
    TextField
} from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import { Notification, useTranslate, useLogin, useNotify, defaultTheme } from 'react-admin';

const useStyles = makeStyles(
    theme => ({
        main: {
            position: 'relative',
            padding: '2em',
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage:
                'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
        },
        form: {
            position: 'absolute',
            top: 0,
            margin: '10% auto',
            left: 0,
            right: 0,
            width: 'fit-content',
            minWidth: 300,
        },
        exampleCard: {
            marginBottom: '5%',
            bottom: '0',
            position: 'absolute',
            minWidth: 300,
            paddingLeft: '2em',
            paddingRight: '2em',
            backgroundColor: 'lightyellow',
            opacity: '0.4',
            "@media (max-width: 600px)": {
                display: "none",
            }
        },
        avatar: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
        },
        icon: {
            backgroundColor: theme.palette.secondary.main,
        },
        hint: {
            padding: '1em',
            color: theme.palette.grey[500],
            "@media (max-width: 600px)": {
                display: "none",
            }
        },
        inputGroup: {
            padding: '0 1em 1em 1em',
        },
        input: {
            marginTop: '1em',
        },
        actions: {
            padding: '0 1em 1em 1em',
        },
    }),
    { name: 'RaLogin' }
);

const renderInput = ({
                         meta: { touched, error } = { touched: false, error: undefined },
                         input: { ...inputProps },
                         ...props
                     }) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

interface FormValues {
    username?: string;
}

const { Form } = withTypes<FormValues>();

// @ts-ignore
const Login = ({theme, ...props}) => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const classes = useStyles();
    const notify = useNotify();
    const login = useLogin();
    const location = useLocation<{ nextPathname: string } | null>();

    const permsAsString =
        ['}','"res', '"act', '"f', '"rec', '"id']
            .reduce((acc, x)=>acc.replace(
                    new RegExp(`\\s{3,}${x}`, 'g'), x),
                JSON.stringify(permissions, null, 2))
            .replace(/^\s+"user\S+".*\n/gm, '')

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(auth, location.state ? location.state.nextPathname : '/').catch(
            (error: Error) => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                            ? 'ra.auth.sign_in_error'
                            : error.message,
                    'warning',
                    {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                    ? error.message
                                    : undefined,
                    }
                );
            }
        );
    };

    const validate = (values: FormValues) => {
        const errors: FormValues = {};
        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        return errors;
    };

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validate}
            render={({ handleSubmit }) => (
                <div className={classes.main}>
                    <Card className={classes.exampleCard}>
                        <div>
                            <h3>The permissions used in the example:</h3>
                            <pre>{permsAsString}</pre>
                        </div>
                    </Card>
                    <form onSubmit={handleSubmit} noValidate className={classes.form}>
                        <div>
                            <Card>
                                <div className={classes.avatar}>
                                    <Avatar className={classes.icon}>
                                        <LockIcon />
                                    </Avatar>
                                </div>
                                <div className={classes.hint}>
                                    admin   - full rights<br/>
                                    corrector   - can't delete, can't see Users, doesn't see Price in Posters<br/>
                                    reader   - only reading<br/>
                                    user    - sees Posters exluding Price, can change 2 records and delete one<br/>
                                </div>
                                <div className={classes.inputGroup}>
                                    <div className={classes.input}>
                                        <Field
                                            autoFocus
                                            name="username"
                                            // @ts-ignore
                                            component={renderInput}
                                            label={translate('ra.auth.username')}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <CardActions className={classes.actions}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading && (
                                            <CircularProgress
                                                size={25}
                                                thickness={2}
                                            />
                                        )}
                                        {translate('ra.auth.sign_in')}
                                    </Button>
                                </CardActions>
                            </Card>
                            <Notification />
                        </div>
                    </form>
                </div>
            )}
        />
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const LoginWithTheme = (props: any) => (
    <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <Login {...props} />
    </ThemeProvider>
);

export default LoginWithTheme;
