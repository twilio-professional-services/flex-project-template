export const useSegment = () => {
	if(!window?.analytics) throw Error('segment not defined');
	return window?.analytics;
}