import React from "react";

function useEventListener(target, type, handler, options) {
	const savedHandler = React.useRef();
	React.useEffect(() => { savedHandler.current = handler; }, [handler]);
	// store handler in ref so it can be replaced "hot" without re-registering the event listener
	// savedHandler.current is used from the actual listener below
	React.useEffect(() => {
		if (!type) return;
		let targetElement = null;
		if (!target) return;
		if (typeof target === 'object' && 'current' in target) targetElement = target.current;
		else targetElement = target;
		if (!targetElement) return;
		const opts = { ...(options || {}) };
		if (opts.passive === undefined && type === 'scroll') opts.passive = true;
		const eventListener = event => savedHandler.current && savedHandler.current(event);
		targetElement.addEventListener(type, eventListener, opts);
		return () => {
			try { targetElement.removeEventListener(type, eventListener, opts); } catch (e) {}
		};
	}, [target, type, options]);
}

function WindowClickCounter(){
	const [count, setCount] = React.useState(0);
	useEventListener(window, 'click', () => setCount(c => c + 1));
	return (
		<div>
			<h3>Window Clicks</h3>
			<p>Clicks: {count}</p>
		</div>
	);
}

function KeyPressToggle(){
	const [enabled, setEnabled] = React.useState(false);
	const [lastKey, setLastKey] = React.useState(null);
	useEventListener(enabled ? window : null, 'keydown', (e) => setLastKey(e.key));
	return (
		<div>
			<h3>Key Press Listener</h3>
			<label>
				<input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Show last key
			</label>
			<p>Last key: {lastKey ?? '-'}</p>
		</div>
	);
}

function useFetch(url){
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);
	const controllerRef = React.useRef(null);
	const fetchData = React.useCallback((signal) => {
		setLoading(true);
		setError(null);
		return fetch(url, { signal })
			.then(res => {
				if (!res.ok) throw new Error(res.statusText || 'Fetch error');
				return res.json();
			})
			.then(json => { setData(json); return json; });
	}, [url]);

	const execute = React.useCallback(() => {
		if (!url) return;
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
		const c = new AbortController();
		controllerRef.current = c;
		return fetchData(c.signal)
			.catch(err => {
				if (err.name === 'AbortError') return;
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [fetchData]);

	React.useEffect(() => {
		execute();
		return () => {
			if (controllerRef.current) controllerRef.current.abort();
		};
	}, [url, execute]);

	const refetch = React.useCallback(() => {
		return execute();
	}, [execute]);

	return { data, loading, error, refetch };
}

function FetchTodosDemo(){
	const { data, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
	return (
		<div>
			<h3>Todos (limit 5)</h3>
			<button onClick={() => refetch && refetch()}>Refetch</button>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {String(error)}</p>}
			{data && Array.isArray(data) && (
				<ul>
					{data.map(t => <li key={t.id}>{t.title}</li>)}
				</ul>
			)}
		</div>
	);
}

function HooksExamples(){
	return (
		<div>
			<WindowClickCounter />
			<KeyPressToggle />
			<FetchTodosDemo />
		</div>
	);
}

export { useEventListener, useFetch, WindowClickCounter, KeyPressToggle, FetchTodosDemo, HooksExamples };
