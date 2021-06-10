import {createWiki} from "./Wiki";

export default {
    title: 'Example/Wiki',
    argTypes: {
    },
};

const Template = (args) => createWiki(args);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
    ...{a: '2', b: '3'},
};

