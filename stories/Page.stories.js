import {createPage} from './Page';
import * as HeaderStories from './Header.stories';
import {injectHTML} from "../sharepoints/inject-html";

export default {
    title: 'Example/Page',
    argTypes: {
        selector: {control: 'text'},
        contentToInject: {control: 'text'},
    },
    loaders: [async () => ({SharePointTemplate: await import('../public/snapshots/blank/js-stories/2021-06-12T09$42$28_614Z.js')})],
};

export const Template = (args, {loaded}) => {
    console.log('args: ', args);
    const sharePointTemplate = loaded.SharePointTemplate.getTemplate({});
    if (("selector" in args) && ("contentToInject" in args)) {
        const content = injectHTML(sharePointTemplate, args.selector, args.contentToInject);
        return createPage({...args, sharePointTemplate: content});
    } else {
        return createPage({...args, sharePointTemplate});
    }
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
    ...HeaderStories.LoggedIn.args,
};
//
// export const LoggedOut = Template.bind({});
// LoggedOut.args = {
//   ...HeaderStories.LoggedOut.args,
// };
