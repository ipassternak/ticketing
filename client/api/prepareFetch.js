export default function prepareFetch(req) {
  const domain =
    typeof window === 'undefined'
      ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
      : '';
  return (url, init = {}) => {
    const headers = { ...(init.headers || {}), ...req?.headers };
    const reqInit = { ...init, headers };
    return fetch(`${domain}${url}`, reqInit);
  };
}
