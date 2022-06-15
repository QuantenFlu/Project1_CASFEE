const app = (await import('./app.js')).app;

const hostname = '127.0.0.1';
const port = 3001;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://${hostname}:${port}`);
});
