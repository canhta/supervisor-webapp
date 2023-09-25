import HlsPlayer from '@/components/HlsPlayer';

const ViewPage = ({ params }: { params: { slug: string } }) => {
  const src = `http://27.71.25.236:8080/live/${params.slug}.m3u8`;
  return <HlsPlayer src={src} />;
};

export default ViewPage;
