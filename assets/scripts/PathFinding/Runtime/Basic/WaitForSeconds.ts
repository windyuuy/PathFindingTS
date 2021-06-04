
export function WaitForSeconds(secs: number): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, secs * 1000)
	})
}
