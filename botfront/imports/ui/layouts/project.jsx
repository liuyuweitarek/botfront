import { withTracker } from 'meteor/react-meteor-data';
import 'react-s-alert/dist/s-alert-default.css';
import { browserHistory } from 'react-router';
import windowSize from 'react-window-size';
import SplitPane from 'react-split-pane';
import { Meteor } from 'meteor/meteor';
import Intercom from 'react-intercom';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import yaml from 'js-yaml';
import React from 'react';
import {
    Placeholder, Header, Menu, Container, Button, Loader, Popup, Image,
} from 'semantic-ui-react';

import ProjectSidebarComponent from '../components/project/ProjectSidebar';
import { Projects } from '../../api/project/project.collection';
import { setProjectId } from '../store/actions/actions';
import { Credentials } from '../../api/credentials';
import 'semantic-ui-css/semantic.min.css';
import store from '../store/store';
import { GlobalSettings } from '../../api/globalSettings/globalSettings.collection';

const ProjectChat = React.lazy(() => import('../components/project/ProjectChat'));

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIntercom: false,
            intercomId: '',
            showChatPane: false,
            resizingChatPane: false,
        };
    }

    componentDidUpdate() {
        const { showIntercom } = this.state;
        if (window.Intercom && showIntercom) {
            window.Intercom('show');
            window.Intercom('update', {
                hide_default_launcher: true,
            });
            window.Intercom('onHide', () => {
                this.setState({ showIntercom: false });
            });
        }
    }

    handleChangeProject = (projectId) => {
        const { router: { replace, location: { pathname } } = {} } = this.props;
        replace(pathname.replace(/\/project\/.*?\//, `/project/${projectId}/`));
    };

    getIntercomUser = () => {
        const { _id, emails, profile } = Meteor.user();
        return {
            user_id: _id,
            email: emails[0].address,
            name: profile.firstName,
        };
    };

    handleTriggerIntercom = (id) => {
        this.setState({
            intercomId: id,
            showIntercom: true,
        });
    };

    triggerChatPane = () => {
        this.setState(state => ({
            showChatPane: !state.showChatPane,
        }));
    };

    renderPlaceholder = (inverted, fluid) => (
        <Placeholder fluid={fluid} inverted={inverted} className='sidebar-placeholder'>
            <Placeholder.Header>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>
    );

    render() {
        const {
            children, projectId, loading, channel, renderLegacyModels, settings,
        } = this.props;
        const {
            showIntercom, intercomId, showChatPane, resizingChatPane,
        } = this.state;

        return (
            <div style={{ height: '100vh' }}>
                {showIntercom && !loading && <Intercom appID={intercomId} {...this.getIntercomUser()} />}
                <div className='project-sidebar'>
                    {(settings && settings.settings && settings.settings.public && settings.settings.public.logoUrl) ? (
                        <Header as='h1' className='logo'>
                            <Image src={!loading ? settings.settings.public.logoUrl : ''} centered className='custom-logo' />
                        </Header>
                    ) : (
                        <Header as='h1' className='logo'>
                            Botfront.
                        </Header>
                    )}
                    {(settings && settings.settings && settings.settings.public && settings.settings.public.smallLogoUrl) ? (
                        <Header as='h1' className='simple-logo'>
                            <Image src={!loading ? settings.settings.public.smallLogoUrl : ''} centered className='custom-small-logo' />
                        </Header>
                    ) : (
                        <Header as='h1' className='simple-logo'>
                            B.
                        </Header>
                    )}
                    {loading && this.renderPlaceholder(true, false)}
                    {!loading && (
                        <ProjectSidebarComponent
                            projectId={projectId}
                            handleChangeProject={this.handleChangeProject}
                            triggerIntercom={this.handleTriggerIntercom}
                            renderLegacyModels={renderLegacyModels}
                        />
                    )}
                </div>
                <div className='project-children'>
                    <SplitPane
                        split='vertical'
                        minSize={showChatPane ? 300 : 0}
                        defaultSize={showChatPane ? 300 : 0}
                        maxSize={showChatPane ? 600 : 0}
                        primary='second'
                        allowResize={showChatPane}
                        className={resizingChatPane ? '' : 'width-transition'}
                        onDragStarted={() => this.setState({ resizingChatPane: true })}
                        onDragFinished={() => this.setState({ resizingChatPane: false })}
                    >
                        {loading && (
                            <div>
                                <Menu pointing secondary style={{ background: '#fff' }} />
                                <Container className='content-placeholder'>{this.renderPlaceholder(false, true)}</Container>
                            </div>
                        )}
                        {!loading && (
                            <div data-cy='left-pane'>
                                {children}
                                {!showChatPane && channel && (
                                    <Popup
                                        trigger={<Button size='big' circular onClick={this.triggerChatPane} icon='comment' primary className='open-chat-button' data-cy='open-chat' />}
                                        content='Try out your chatbot'
                                    />
                                )}
                            </div>
                        )}
                        {!loading && showChatPane && (
                            <React.Suspense fallback={<Loader active />}>
                                <ProjectChat channel={channel} triggerChatPane={this.triggerChatPane} projectId={projectId} />
                            </React.Suspense>
                        )}
                    </SplitPane>
                </div>
                <Alert stack={{ limit: 3 }} />
            </div>
        );
    }
}

Project.propTypes = {
    router: PropTypes.object.isRequired,
    windowHeight: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    channel: PropTypes.object,
    settings: PropTypes.object,
};

Project.defaultProps = {
    channel: null,
    settings: {},
};

const ProjectContainer = withTracker((props) => {
    const {
        params: { project_id: projectId },
    } = props;
    let projectHandler = null;
    let renderLegacyModels;
    if (!projectId) return browserHistory.replace({ pathname: '/404' });
    projectHandler = Meteor.subscribe('projects', projectId);
    const nluModelsHandler = Meteor.subscribe('nlu_models.lite', projectId);
    const credentialsHandler = Meteor.subscribe('credentials', projectId);
    const settingsHandler = Meteor.subscribe('settings');
    const settings = GlobalSettings.findOne({}, { fields: { 'settings.public.logoUrl': 1, 'settings.public.smallLogoUrl': 1 } });
    const introStoryGroupIdHandler = Meteor.subscribe('introStoryGroup', projectId);
    const readyHandler = handler => (handler);
    const readyHandlerList = [
        Meteor.user(),
        credentialsHandler.ready(),
        settingsHandler.ready(),
        projectHandler ? projectHandler.ready() && nluModelsHandler.ready() : nluModelsHandler.ready(),
        introStoryGroupIdHandler.ready(),
    ];
    const ready = readyHandlerList.every(readyHandler);
    const project = Projects.findOne({ _id: projectId }, { fields: { _id: 1, nlu_models: 1 } });

    if (ready && !project) {
        return browserHistory.replace({ pathname: '/404' });
    }

    if (project) {
        renderLegacyModels = false;
    }

    let channel = null;
    if (ready) {
        let credentials = Credentials.findOne({ $or: [{ projectId, environment: { $exists: false } }, { projectId, environment: 'development' }] });
        credentials = credentials && yaml.safeLoad(credentials.credentials);
        channel = credentials['rasa_addons.core.channels.webchat.WebchatInput'];
    }

    // update store if new projectId
    if (store.getState().settings.get('projectId') !== projectId) {
        store.dispatch(setProjectId(projectId));
    }

    return {
        loading: !ready,
        projectId,
        channel,
        renderLegacyModels,
        settings,
    };
})(windowSize(Project));

export default ProjectContainer;
