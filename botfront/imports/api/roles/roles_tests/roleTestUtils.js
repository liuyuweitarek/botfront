export const formatRoles = (userRoles, project) => ({ roles: [{ roles: userRoles, project }] });

export const roles = [
    'nlu-data:r',
    'nlu-data:w',
    'nlu-data:x',
    'responses:r',
    'responses:w',
    'stories:r',
    'stories:w',
    'triggers:r',
    'triggers:w',
    'incoming:r',
    'incoming:w',
    'analytics:r',
    'analytics:w',
    'resources:r',
    'resources:w',
    'projects:r',
    'projects:w',
    'global-settings:r',
    'global-settings:w',
    'roles:r',
    'roles:w',
    'users:r',
    'users:w',
    'global-admin',
];

export const readers = {
    nluData: [
        'nlu-data:r',
        'nlu-data:w',
        'stories:r',
        'stories:w',
        'triggers:r',
        'triggers:w',
        'incoming:r',
        'incoming:w',
        'analytics:r',
        'analytics:w',
        'global-admin',
        'projects:w',
        'projects:r',
        'resources:r',
        'resources:w',
    ],
    responses: [
        'responses:r',
        'responses:w',
        'stories:r',
        'stories:w',
        'triggers:r',
        'triggers:w',
        'incoming:r',
        'incoming:w',
        'analytics:r',
        'analytics:w',
        'global-admin',
        'projects:w',
        'projects:r',
        'resources:r',
        'resources:w',
    ],
    incoming: [
        'incoming:r',
        'incoming:w',
        'analytics:r',
        'analytics:w',
        'global-admin',
        'projects:w',
        'projects:r',
        'resources:r',
        'resources:w',
    ],
    analytics: [
        'analytics:r',
        'analytics:w',
        'global-admin',
        'projects:w',
        'projects:r',
        'resources:r',
        'resources:w',
    ],
    projects: [
        'projects:w',
        'projects:r',
        'global-admin',
        'resources:r',
        'resources:w',
    ],
    resources: [
        'global-admin',
        'resources:r',
        'resources:w',
    ],
    stories: [
        'stories:r',
        'stories:w',
        'triggers:r',
        'triggers:w',
        'incoming:r',
        'incoming:w',
        'analytics:r',
        'analytics:w',
        'global-admin',
        'projects:w',
        'projects:r',
        'resources:r',
        'resources:w',
    ],
    roles: [
        'roles:r',
        'roles:w',
        'users:w',
        'users:r',
        'global-admin',
    ],
    users: [
        'users:r',
        'users:w',
        'global-admin',
    ],
    globalSettings: [
        'global-settings:w',
        'global-settings:r',
        'global-admin',
    ],
};

export const writers = {
    nluData: [
        'nlu-data:w',
        'incoming:w',
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    responses: [
        'responses:w',
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    incoming: [
        'incoming:w',
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    analytics: [
        'analytics:w',
        'global-admin',
        'resources:w',
        'projects:w',
    ],
    roles: [
        'roles:w',
        'global-admin',
    ],
    projects: [
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    resources: [
        'resources:w',
        'global-admin',
    ],
    globalSettings: [
        'global-settings:w',
        'global-admin',
    ],
    stories: [
        'stories:w',
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    triggers: [
        'triggers:w',
        'resources:w',
        'projects:w',
        'global-admin',
    ],
    users: [
        'users:w',
        'global-admin',
    ],
};

export const otherRoles = {
    nluDataX: [
        'nlu-data:x',
        'projects:w',
        'resources:w',
        'global-admin',
    ],
    shareX: [
        'share:x',
        'projects:w',
        'resources:w',
        'global-admin',
    ],
};
