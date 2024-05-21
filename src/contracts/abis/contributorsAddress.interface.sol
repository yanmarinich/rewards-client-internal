// https://bia.is/tools/abi2solidity/
// https://sepolia.arbiscan.io/address/0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79#readContract

struct ValidatorReward{
  address validator;
  uint256 reward;
}

interface GeneratedInterface {
  function accessControlEnumerable() external view returns (address);

  function getValidatedContribution( uint256 _id ) external view returns (
    uint256, string, string, string, string, uint256, /*ValidatorReward*/[]
  );

  function validatedContributionCount() external view returns (uint256);

  function setAccessControlEnumerable( address _accessControlEnumerable ) external;
  function addValidatedContribution(
    uint256 _contribution_id,
    string _metadata_identifier,
    string _validator_address,
    string _address_chain,
    string _token,
    uint256 _reward,
    address[] _validator_addresses,
    uint256[] _validator_rewards
  ) external returns (bool success);

}


// test (random input data)
// https://sepolia-explorer.arbitrum.io/tx/0x7a0eded666e029aa4c72c32c9bfa85e429fef55fce21fccc7d11124df4530761

addValidatedContribution():

  _contribution_id (uint256)
    >> 0
  _metadata_identifier (string)
    >> meta
  _validator_address (string)
    >> 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  _address_chain (string)
    >> 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  _token (string)
    >> 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  _reward (uint256)
    >> 10000000000000000000
  _validator_addresses (address[])
    >> [0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79]
  _validator_rewards (uint256[])
    >> [10000000000000000000]


getValidatedContribution():
  uint256 : 0
  string : meta
  string : 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  string : 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  string : 0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
  uint256 : 10000000000000000000
  tuple[] : [[0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79,10000000000000000000]]
