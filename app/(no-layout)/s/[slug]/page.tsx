import HlsPlayer from '@/components/HlsPlayer';

const ViewPage = ({ params }: { params: { slug: string } }) => {
  const src = `https://test-streams.mux.dev/${params.slug}/${params.slug}.m3u8`;
  return <HlsPlayer src={src} />;
};

export default ViewPage;
