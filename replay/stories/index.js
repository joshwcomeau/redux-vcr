import './index.scss';

// Require all stories programmatically. This way we don't have to import manually.
function requireAll(r) { r.keys().forEach(r); }

requireAll(require.context('./', true, /\.js$/));
