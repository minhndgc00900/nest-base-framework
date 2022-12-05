import { Job } from 'bull';

const UserProcessor = async (job: Job) => {
  if (typeof job.data == 'number') {
    job.data += 1;
  } else if (typeof job.data == 'string') {
    job.data += ' Job Has Been Processed';
  } else if (typeof job.data == 'object') {
    job.data.status = 'Job Has Been Processed';
  }
  console.log('Job processed');
  return job;
};

export default UserProcessor;
