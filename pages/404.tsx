export const getStaticProps = async () => ({
  props: {
    layout: 'unLoggedIn',
  },
});
const NotFoundPage = () => <>404</>;

export default NotFoundPage;
