import {createPage} from './Page';
import * as HeaderStories from './Header.stories';

export default {
    title: 'Example/Page',
    loaders: [async () => ({SharePointTemplate: await import('../public/snapshots/wiki/js-stories/2021-06-11T12$06$58_559Z.js')})],
};

export const Template = (args, {loaded}) => {
    const sharePointTemplate = loaded.SharePointTemplate.getTemplate({});
    return createPage({...args, sharePointTemplate});
};

// export const LoggedIn = Template.bind({});
// LoggedIn.args = {
//   ...HeaderStories.LoggedIn.args,
// };
//
// export const LoggedOut = Template.bind({});
// LoggedOut.args = {
//   ...HeaderStories.LoggedOut.args,
// };
