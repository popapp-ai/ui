import { resolveAssetPath } from "../utils/resolve-asset-path";

export function PreviewImage({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="custom_Preview" >
      <img
        src={resolveAssetPath(src)}
        alt={alt ?? ''}
        style={{
          maxWidth: 320,
          width: '100%',
          display: 'block',
        }}
      />
    </div>
  )
}
