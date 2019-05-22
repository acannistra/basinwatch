/**
 *
 * Asynchronously loads the component for InfoBar
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
