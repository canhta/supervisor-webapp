import FlvPlayer from '@/components/FlvPlayer';

const ViewPage = ({ params }: { params: { slug: string } }) => {
  const url = `http://27.71.25.236:8080/live/${params.slug}.flv`;
  return (
    <FlvPlayer
      url={url}
      showControls={true}
      enableStashBuffer={true}
      isMuted={false}
      isLive={true}
    />
  );
};

export default ViewPage;
